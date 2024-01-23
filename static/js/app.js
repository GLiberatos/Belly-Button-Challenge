// URL of JSON Data
const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON data - async functionality with try...catch
async function fetchData(url) {
  try {
    const response = await d3.json(url);
    console.log("Fetched Data:", response);

    // Call the functions that rely on the fetched data
    populateDropdown(response.names);
    createChart(response.samples[0], response.metadata[0].wfreq);
    createMetadata(response.metadata[0]);
    setupDropdownChangeHandler(response.samples, response.metadata);

    return response;
  } catch (error) {
    console.error("Error Fetching Data:", error);
    throw error;
  }
}

// Populate Dropdown with JSON data
function populateDropdown(names) {
  const dataSelect = d3.select("#selDataset");
  const options = dataSelect.selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .text(data => data)
    .attr("value", data => data);
}

// Create metadata panel
function createMetadata(sample) {
  function capitalizeFirstWordBeforeColon(str) {
    const parts = str.split(':');
    if (parts.length > 1) {
      const firstWord = parts[0].trim().toUpperCase();
      return `${firstWord}: ${parts.slice(1).join(':').trim()}`;
    }
    return str.toUpperCase();
  }

  const panel = d3.select("#sample-metadata");
  panel.selectAll("*").remove();
  panel.selectAll("h6")
    .data(Object.entries(sample))
    .enter()
    .append("h6")
    .html(([names, metadata]) => `<strong>${capitalizeFirstWordBeforeColon(names)}</strong>: ${metadata}`);
}

// Create Chart with modified colors
function createChart(sample, freq) {
  const {otu_ids, sample_values, otu_labels} = sample;
  const wfreq = parseInt(freq);

  // Prepare Data for Bar Chart
  const sampleData = otu_ids.map((otu_id, index) => ({
    otu_id,
    sample_value: sample_values[index],
    otu_label: otu_labels[index]
  }));

  const topOTU = sampleData.sort((a, b) => b.sample_value - a.sample_value).slice(0, 10).reverse();
  const barTrace = {
    x: topOTU.map(({ sample_value }) => sample_value),
    y: topOTU.map(({ otu_id }) => `OTU ${otu_id}`),
    text: topOTU.map(({ otu_label }) => otu_label),
    type: "bar",
    orientation: 'h',
    marker: {
      color: topOTU.map(({ sample_value }) => sample_value),
      colorscale: [[0, 'rgb(233,245,206)'], [0.25, 'rgb(198,233,180)'], [0.45, 'rgb(156,215,140)'], [0.65, 'rgb(107,191,89)'], [0.85, 'rgb(66,162,54)'], [1, 'rgb(35,132,27)']],
      opacity: 0.65,
      line: {
        color: 'rgb(8,48,107)',
        width: 0.15
      }
    }
  };

  // Bar Chart Layout
  const barLayout = {
    xaxis: {title: {text: "Value of OTU's", font: {size: 13, color: 'rgb(145, 145, 145)'}}},
    yaxis: {tickfont: { size: 10, color: 'rgb(145, 145, 145)' }},
    font: {family: 'Calibri, sans-serif', size: 12, color: 'rgb(25, 25, 25)'},
    margin: { l: 95, r: 95, b: 75, t: 75 },
    width: 515, 
    height: 450
  };

  // Gauge Chart Layout and Pointer
  const gaugeLayout = {
    shapes: [{
      type: 'path',
      path: gaugePointer((wfreq / 10) * 100),
      fillcolor: 'rgb(145, 145, 145)',
      line: { color: '850000' },
    }],
    xaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
    yaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
    width: 495,
    height: 450,
    margin: { t: 100, b: 0, l: 30, r: 75 },
    font: {family: 'Calibri, sans-serif', color: 'rgb(145, 145, 145)'},
  };

  // Gauge Colors
  const gaugeColors = [
    'rgba(233,245,206, .99)', 'rgba(233,245,206, .85)',
    'rgba(198,233,180, .95)', 'rgba(198,233,180, .75)',
    'rgba(156,215,140, .65)', 'rgba(107,191,89, .75)',
    'rgba(66,162,54, .75)', 'rgba(35,132,27, .75)',
    'rgba(24,109,22, .5)', 'white',
  ];

  // Gauge Data
  const gaugeData = [{
    type: 'scatter',
    x: [0], y: [0],
    marker: { size: 18, color: '850000' },
    showlegend: false,
    name: '# of Washings',
    text: wfreq,
    hoverinfo: 'text+name'
  }, {
    values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition: 'inside',
    marker: {colors: gaugeColors},
    labels: ['8-9 Washings', '7-8 Washings', '6-7 Washings', '5-6 Washings', '4-5 Washings', '3-4 Washings', '2-3 Washings', '1-2 Washings', '0-1 Washings', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  // Bubble Chart Data and Layout
  const bubbleTrace = {
    x: sampleData.map(data => data.otu_id),
    y: sampleData.map(data => data.sample_value),
    text: sampleData.map(data => data.otu_label),
    mode: "markers",
    marker: {
      size: sampleData.map(data => data.sample_value),
      color: sampleData.map(data => data.otu_id),
      colorscale: [
        [0, 'rgb(233,245,206)'],
        [0.25, 'rgb(198,233,180)'],
        [0.45, 'rgb(156,215,140)'],
        [0.65, 'rgb(107,191,89)'],
        [0.85, 'rgb(66,162,54)'],
        [1, 'rgb(35,132,27)']
      ]
    }
  };

  const bubbleLayout = {
    xaxis: {title: {text: "OTU ID", font: {size: 11, color: 'rgb(145, 145, 145)'}}},
    yaxis: {title: {text: "Value of OTU's", font: {size: 11, color: 'rgb(145, 145, 145)'}}},
    width: 1200,
    height: 450,
    margin: { t: 75, b: 75, l: 75, r: 125 }
  };

  // Plot the charts
  Plotly.newPlot("bar", [barTrace], barLayout);
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
}

// Function for gauge pointer path calculation
function gaugePointer(wfreq) {
  wfreq = parseInt(wfreq) / 10;
  const angle = ((180 - (wfreq * 20)) * Math.PI / 180);
  const x = 0.5 * Math.cos(angle);
  const y = 0.5 * Math.sin(angle);
  return `M 0 -0.035 L ${x} ${y} A 0.5 0.5 0 0 1 ${-x} ${y} Z`;
}

// Update Plot on Dropdown Change
function setupDropdownChangeHandler(samples, metadata) {
  d3.select("#selDataset").on("change", function () {
    const selectedID = this.value;
    const selectedSample = samples.find(sample => sample.id === selectedID);
    const selectedMetadata = metadata.find(sample => sample.id === parseInt(selectedID));
    createChart(selectedSample, selectedMetadata.wfreq);
    createMetadata(selectedMetadata);
  });
}

// Fetch data and initialize the page
async function initializePage() {
  try {
    const data = await fetchData(dataUrl);
    console.log('wfreq value:', data.metadata[0].wfreq);
    populateDropdown(data.names);
    createChart(data.samples[0], data.metadata[0].wfreq);
    createMetadata(data.metadata[0]);
    setupDropdownChangeHandler(data.samples, data.metadata);
  } catch (error) {
    console.error('Error initializing page:', error);
  }
}

// Trigger the data fetching and initialization
initializePage();
