# Interactive Web Visualizations

## Introduction

This project demonstrates the use of D3.js and Plotly to create interactive web visualizations. It fetches JSON data from a specified URL and dynamically generates a dropdown menu, a metadata panel, and three types of charts: a bar chart, a gauge chart, and a bubble chart. The visualizations focus on displaying various aspects of the data, such as operational taxonomic units (OTUs) sampled in a biological study, washing frequency, and other metadata related to the study.

## Features

- **Dynamic Dropdown Menu:** Populates options based on the names array from the fetched JSON data.
- **Metadata Panel:** Displays selected sample's metadata in a formatted manner.
- **Bar Chart:** Visualizes the top 10 OTUs found in the selected sample.
- **Gauge Chart:** Shows the washing frequency of the selected sample with a dynamically calculated pointer.
- **Bubble Chart:** Plots each OTU against its sample value with bubble size representing the sample value and color indicating the OTU ID.

## Setup

To set up this project locally, follow these steps:

1. **Clone the repository:**
git clone https://github.com/GLiberatos/Belly-Button-Challenge.git
2. **Navigate to the project directory:**
cd Belly-Button-Challenge
3. **Open the project:**
- Open `index.html` in a web browser to view the project.
- Ensure your web server is configured to serve the files if accessing via a localhost server.

## Usage

- **Select a Sample:** Use the dropdown menu to select a sample ID. The visualizations and metadata panel will update automatically to reflect the data associated with the selected sample.
- **Interact with Charts:** Hover over the charts to see additional details about the data points.

## Technologies Used

- **D3.js:** A JavaScript library for producing dynamic, interactive data visualizations in web browsers.
- **Plotly.js:** A graphing library for making interactive, publication-quality graphs online.
- **HTML/CSS:** For structuring and styling the web page.

## Contributing

Contributions to improve the project are welcome. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b your-branch-name`.
3. Make your changes and commit them: `git commit -am 'Add some feature'`.
4. Push to the original branch: `git push origin your-repo-name/your-branch-name`.
5. Create the pull request.
