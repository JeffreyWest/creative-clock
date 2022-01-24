function drawClock() {			
	d3.select("#clockMain").remove();
	//d3.select("#myCircle").remove();
	
	svg = d3.select(".clock_and_legend").append("svg")
		.attr("id", "clockMain")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//Draw the Circle
	innerCircle = svg.append("circle")
			.attr("id", "myCircle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radius - 90)
      .attr("fill", "#fff")
      .attr("stroke", "black")
       .attr("stroke-width", 2);
       
  var outlineBox = svg.append("rect")
      .attr("x", -(outlineBoxWidth/2))
      .attr("y", -(outlineBoxHeight/2 + 7))
      //.attr("width", 350)
      //.attr("height", 100)
      .attr("width", outlineBoxWidth)
      .attr("height", outlineBoxHeight)
      .attr("fill", "#fff")
      .attr("stroke", "black")
       .attr("stroke-width", 2);
       
  timeLabel = svg.append("text")
	   .attr("text-anchor", "middle")
	   .style("font-size", globalFontSize)
	   .style("id","currentTime")
	   .style("font-family", "PT Serif")
	   .text("Choose a category");
	
	
	d3.csv(fileName, type, function(error, data) {
	  if (error) throw error;
		
		
	  var g = svg.selectAll(".arc")
	      .data(pie(data))
	    .enter().append("g")
	      .attr("class", "arc");

	  g.append('path')
    	.attr('d', arc)
			.attr('fill', function(d, i) {
				return color(timeData[i]);
    })
    .on("mouseover", function(d) {
      d3.select(this).transition()
        .duration(100)
        .attr("d", arcOver);
      d3.select(this).style("cursor", "pointer");
      timeLabel.text(d.data.time);          
    })
    .on("mouseout", function(d) {
      d3.select(this).transition()
        .duration(1000)
        .attr("d", arc);
        
      d3.select(this).style("cursor", "default")
        
        if (firstTime != 0) {
          timeLabel.text("Add time for " + legendEntries[currentColor]);
        } else {
          timeLabel.text("Choose a category");
        }
        
      
    })
    .on("click", function(d, i) {
      d3.select(this)
      	.attr("fill", function(d) {
	      	
	      	// update timeData with selection
	      	timeData[i] = currentColor;
	      	drawBarGraph();
	      	
	      	var newColor = color(currentColor);
	      	
	      	newColor = newColor == newColor ? newColor : color(0);
	        d3.select(this).style("fill", newColor);
	      	
      	})
    }); 
	});
	
}


function drawBarGraph() {
					
	d3.select("#bargraph").remove();
	
	
	var barGraph = legend.append("svg")
    .attr("width", width)
    .attr("height", legendHeight)
    .attr("id","bargraph");
    
  var bot = barGraph.append("path")
		.attr("d", lineFunction(lineData))
		.attr("stroke", "black")
		.attr("stroke-width", 4)
		.attr("fill", "none");

	barGraph.selectAll("rect")
 		.data(color)
 		.enter()
 		.append("rect")
   		.attr("x", function(d, i) {
		    return (bargraphHorizOffset + 2);
			})
	 		.attr("y", function(d, i) {
				return i * 70 + legendOffset;
			})
			.attr("width", function(d, i) {
				return calculateHeight(i);
			})
			.attr("height", 30)
			.attr("fill", function(d, i) {
		    return color(i);
			});
		
		
	// add legend labels
	for (ii = 0; ii < legendEntries.length; ii++) {
		d3.select(".hourLabels-" + ii).remove();
		
		legend.append("text")
			.attr("class", "hourLabels-" + ii)
			.attr("x", bargraphHorizOffset + 30)
			.attr("y", legendOffset - 5 + 70*ii)
			.style("font-family", "PT Serif")
			.style("font-size", 16)
			.text(function(d) {
				
				var divisor = 1;
				
				if (totalHourSegments == 48) {
					divisor = 2;
				}
				
				var hours = calculateHeight(ii)*totalHourSegments/barHeight/divisor;
				
				
				
				return Math.round(hours*2)/2 + " hours";
			});
	}
}
	
function type(d) {
  d.lengthOfTime = +d.lengthOfTime;
  return d;
}

function calculateHeight(myType) {
	var sum = 0;
	for (i = 0; i < timeData.length; i++) { 
		if (timeData[i] == myType) {
			sum++;
		}
	}
	return sum/totalHourSegments*barHeight;
}



function myToggle(button) {
	
	
	
  if(document.getElementById("hoursToggle").value=="OFF"){
	  
   	document.getElementById("hoursToggle").value="ON";
   	
   	totalHourSegments = 48;
   	fileName = "halfhours.csv";
   	
   	// hopefully we always have time data
	  //timeData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,6,6,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,2,2,5,5,2,2,2,2,2,2];

		newTimeData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,6,6,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,2,2,5,5,2,2,2,2,2,2];
		
		for (ii = 0; ii < timeData.length; ii++) {
			for (jj = 0; jj < 2; jj++) {
				newTimeData[2*ii + jj]	= timeData[ii];
			}
		}	
		
		timeData = newTimeData;

   	drawClock();
  }

  else {
	  
   	document.getElementById("hoursToggle").value="OFF";
	 	
	 	totalHourSegments = 24;
   	fileName = "hours.csv";
   	
   	newTimeData = [1,1,1,1,1,1,1,1,2,6,4,0,0,0,0,0,0,0,6,2,5,2,2,2];
   	
   	// if we have switched
   	if (timeData.length == 48) {
	   	for (ii = 0; ii < timeData.length; ii = ii + 2) {
		   	newTimeData[ii/2] = timeData[ii];
	   	}
   	}
   	
   	
   	timeData = newTimeData;
	 	
	 	drawClock();
  }
}

function loadJeffrey() {
	if (totalHourSegments == 48) {
		timeData = [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,6,0,0,0,0,0,2,2,0,0,0,0,2,0,0,0,0,0,2,2,5,5,5,6,4,2,2,2];
	} else {
		timeData = [2,1,1,1,1,1,1,1,1,5,6,0,0,2,0,0,0,0,2,6,5,4,2,2];
	}
	drawClock();
	drawBarGraph();
}