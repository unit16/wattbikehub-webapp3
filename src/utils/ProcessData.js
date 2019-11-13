// Process Raw session file (wbs) data into something more suitable for charting
const ProcessData = async (processOptions) => {
    try {
        let file = processOptions.file;
        let cpIntervals = processOptions.cpIntervals;
        let minIndex = processOptions.minIndex;
        let maxIndex = processOptions.maxIndex;

        let revolutions = [];
        let powerData = [];
        let heartrateData = [];
        let cadenceData = [];
        let cumulativeTime = 0;
        let polarDataFull = [];
        let maxPolarForce = 0;
        let secondsPowerArray = []; // the power at each second during a session
        let cpResults = {}; // holds the values used ofr charting
        let headerData = { // Holds the current state of the top level data, used because these change when data is zoomed
          distance: 0,
          time: 0,
          pes: 0,
          speed: 0,
          energy: 0,
          powerMax: 0,
          powerAvg: 0,
          hrAvg: 0,
          hrMax: 0,
          cadenceAvg: 0,
          cadenceMax: 0,
          balance: 0,
          pes: 0
        }

        console.log("minIndex: ", minIndex);
        console.log("maxIndex: ", maxIndex);
  
        // build a flat array of revolutions and add cumulative session time
        for (let i = 0; i < file.laps.length; i++) {
          for (let j = 0; j < file.laps[i].data.length; j++) {
            cumulativeTime += parseFloat(file.laps[i].data[j].time);
            file.laps[i].data[j].cumulative = cumulativeTime; // add cumulative time to revolution
            revolutions.push(file.laps[i].data[j]);
          }
        }
  
        // build an array of power readings by second rather than revolution
        for (let i = 0; i < Math.round(revolutions[revolutions.length - 1].cumulative); i++) {
          let tempObj = revolutions.find(obj => obj.cumulative >= i); // not ideal for low rpm, i could be way above
          if(tempObj){
              secondsPowerArray[i] = Math.round(tempObj.power);
          }else{
              secondsPowerArray[i] = 0;
          }
        }
  
        // loop flat revolutions array to build data suitable for charting
        let powerAvgSubtotal = 0;
        let hrAvgSubtotal = 0;
        let cadenceAvgSubtotal = 0;
        let pesAvgSubtotal = 0;
        let balanceSubtotal = 0;
        let forceDataErrorCount = 0;

        minIndex = processOptions.minIndex ? processOptions.minIndex : 0;
        maxIndex = processOptions.maxIndex && processOptions.maxIndex !== -1 ? processOptions.maxIndex : revolutions.length;
        
        // revolutions.forEach(function(revolution) {
        for (let i = minIndex; i < maxIndex; i++) {

          let revolution = revolutions[i];

          // Master chart data
          powerData.push([revolution.cumulative, parseInt(revolution.power)]);
          heartrateData.push([revolution.cumulative,parseInt(revolution.heartrate)]);
          cadenceData.push([revolution.cumulative, parseInt(revolution.cadence)]);

          // Header data
          headerData.distance += parseFloat(revolution.distance);
          headerData.time += parseInt(revolution.time);
          headerData.pes = 0;
          headerData.speed = 0;
          headerData.energy += parseFloat(revolution.force);
          headerData.powerMax = (revolution.powerMax > headerData.powerMax) ? revolution.powerMax : headerData.powerMax; 
          headerData.hrMax = (revolution.hrMax > headerData.hrMax) ? revolution.hrMax : headerData.hrMax; 
          headerData.cadenceMax = (revolution.cadenceMax > headerData.cadenceMax) ? revolution.cadenceMax : headerData.cadenceMax;

          // Header subtotals used for averages after the loop is complete
          powerAvgSubtotal += parseInt(revolution.power);
          hrAvgSubtotal += parseInt(revolution.heartrate);
          cadenceAvgSubtotal += parseFloat(revolution.cadence);
          balanceSubtotal += parseFloat(revolution.balance);
          if(revolution.pes){
            pesAvgSubtotal += parseFloat(revolution.pes.combinedCoefficient);
          }else{
            forceDataErrorCount++;
          }

          // Polar chart data
          if (revolution.polar) {
            let polarChartRevolution = [];
            var pointInterval = 0;
            let revolutionMaxForce = 0;
  
            // build one full polar spline
            revolution.polar.force.split(',').forEach(function(value, index) {
              if (index !== 0) {
                if (index <= revolution.polar.lcnt) {
                  pointInterval += 180 / revolution.polar.lcnt;
                } else {
                  pointInterval += 180 / (revolution.polar.cnt - revolution.polar.lcnt);
                }
              }
              
              // get max force value for this rev and all vevolutions
              if (parseInt(value) > maxPolarForce){ maxPolarForce = parseInt(value);}
              if (parseInt(value) > revolutionMaxForce){ revolutionMaxForce = parseInt(value);}
              
              // add point to polar spline
              polarChartRevolution.push([
                parseInt(pointInterval),
                parseInt(value)
              ]);
            });
  
            // add polar spline to full polar stack
            polarDataFull.push({
              colour: 'rgba(0,0,0,0.1)',
              data: polarChartRevolution,
              maxValue: revolutionMaxForce
            });
          }else{
            // add an empty entry if data is missing so indexes match with other charts
            polarDataFull.push({
              colour: 'rgba(0,0,0,0.1)',
              data: [[]],
              maxValue: 0
            });
          }
  
        // });
        };

        // complete some of the averages
        headerData.cadenceAvg = Math.round(cadenceAvgSubtotal / revolutions.length);
        headerData.powerAvg = Math.round(powerAvgSubtotal / revolutions.length);
        headerData.hrAvg = Math.round(hrAvgSubtotal / revolutions.length);
        headerData.balanceAvg = Math.round(balanceSubtotal / revolutions.length);
        headerData.pesAvg = pesAvgSubtotal / (revolutions.length - forceDataErrorCount);
  
        // Critical Power Chart Processing
        // Set up durations to look for and build result objects
        cpIntervals.forEach(function(interval) {
          cpResults[interval] = {
            avg: null,
            watts: null,
            start: null,
            end: null
          };
        })
  
        // Loop over the seconds array and build results based on durations
        for (let i = 0; i < secondsPowerArray.length; i++) {
        
            let tempMax = []; // hold the running totals for each interval range
  
          // find the best x second segments
          cpIntervals.forEach(function(interval) {
            
            tempMax[interval] = 0; // set up the current interval rage total
  
            if (i <= (secondsPowerArray.length - interval)) {
              for (var j = 0; j < interval; j++) {
                tempMax[interval] += secondsPowerArray[i+j];
              }
              if (tempMax[interval] > cpResults[interval].watts) {
                cpResults[interval] = {
                  avg: Math.round(tempMax[interval] / interval),
                  watts: tempMax[interval],
                  start: i,
                  end: i + j
                };
              }
            }
          });
  
        }
  
        // return the processed file data
        let processedData = {
          revolutions: revolutions,
          powerData: powerData,
          heartrateData: heartrateData,
          cadenceData: cadenceData,
          polarDataFull: polarDataFull,
          maxPolarForce: maxPolarForce,
          cpResults: cpResults,
          cpIntervals: cpIntervals,
          headerData: headerData
        };
  
        return processedData;
      } catch (err) {
        throw new Error('Response Error: ' + err);
      }
};

export default ProcessData;
