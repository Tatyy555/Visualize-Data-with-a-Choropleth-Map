const fetchDataAndDraw = async () => {
  // Fetching data
  const res1 = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  );
  let countryData = await res1.json();
  countryData = topojson.feature(
    countryData,
    countryData.objects.counties
  ).features;
  console.log(countryData);

  const res2 = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  );
  let educationalData = await res2.json();
  console.log(educationalData);

  // Build color scale
  let myColor = d3
    .scaleLinear()
    .domain([
      d3.min(educationalData, (d) => {
        return d["bachelorsOrHigher"];
      }),
      d3.max(educationalData, (d) => {
        return d["bachelorsOrHigher"];
      }),
    ])
    .range(["lightyellow", "green"]);

  // Make tooltip
  let tooltip = d3.select("#tooltip").style("opacity", 0);
  var mouseover = function (d) {
    tooltip.style("opacity", 1);
  };
  var mousemove = function (countryItem) {
    let id = countryItem["id"];
    let education = educationalData.find((educationItem) => {
      return educationItem["fips"] === id;
    });
    console.log(d3.mouse(this)[0]);
    tooltip
      .html(
        `${education["area_name"]}-${education["state"]}: <br>${education["bachelorsOrHigher"]}%`
      )
      .attr("data-education", education["bachelorsOrHigher"])
      .style("left", d3.mouse(this)[0] - 400 + "px")
      .style("top", d3.mouse(this)[1] - 750 + "px");
  };
  var mouseleave = function (d) {
    tooltip.style("opacity", 0);
  };

  // Set the size
  let height = 600;
  let width = 1000;
  let padding = 60;
  {
    console.log(countryData);
  }
  let svg = d3
    .select("#map")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "counties")
    .selectAll("path")
    .data(countryData)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("d", d3.geoPath())
    .attr("fill", (countryItem) => {
      let id = countryItem["id"];
      let education = educationalData.find((educationItem) => {
        return educationItem["fips"] === id;
      });
      let percentage = education["bachelorsOrHigher"];
      return myColor(percentage);
      // if (percentage <= 15) {
      //   return "tomato";
      // } else if (percentage <= 30) {
      //   return "orange";
      // } else if (percentage <= 45) {
      //   return "yellow";
      // } else {
      //   return "lightgreen";
      // }
    })
    .attr("data-fips", (countryItem) => {
      return countryItem["id"];
    })
    .attr("data-education", (countryItem) => {
      let id = countryItem["id"];
      let education = educationalData.find((educationItem) => {
        return educationItem["fips"] === id;
      });
      return education["bachelorsOrHigher"];
    })
    // Add Tooltip effect
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Set the size for legend
  let height2 = 60;
  let width2 = 750;
  let padding2 = 60;
  let svg2 = d3.select("#legend").attr("width", width2).attr("height", height2);

  let xAxisScale2 = d3
    .scaleLinear()
    .range([padding2, width2 - padding2])
    .domain([0, 82]);
  svg2
    .append("g")
    .call(
      d3.axisBottom(xAxisScale2).tickFormat((d) => {
        return d + "%";
      })
    )
    .attr("id", "x-axis2")
    .attr("transform", "translate(0, 40)");

  // let yAxisScale2 = d3
  //   .scaleLinear()
  //   .range([0, padding2])
  //   .domain(1);
  // svg2
  // .append("g")
  // .call(d3.axisLeft(yAxisScale2))
  // .attr("id", "y-axis2")
  // .attr("transform", "translate(" + padding2 + ",0)");

  // Add the squares
  svg2
    .selectAll("rect")
    .data(educationalData)
    .enter()
    .append("rect")
    .attr("fill", (d) => {
      return myColor(d["bachelorsOrHigher"]);
    })
    .attr("height", height2 / 2)
    .attr("width", width2 / 10)
    .attr("x", (d) => {
      return xAxisScale2(d["bachelorsOrHigher"]);
    })
    .attr("y", (d) => {
      return 0;
    })
    .attr("transform", "translate(-20, 10)");
};

fetchDataAndDraw();
