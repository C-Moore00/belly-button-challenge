const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

d3.json(url).then(function(data) {
    console.log(data);
    var options = d3.select("#selDataset").selectAll("option")
    .data(data.names)
    .enter()
    .append("option");
    options.text(function(d) {
        return d;
    })
    .attr("value", function(d) {
        return d;
    });
    update();
});

function update(){
    d3.json(url).then(function(data){
        let meta_df = data.metadata.filter(checkID);
        let sample_df = data.samples.filter(checkID);
        console.log(meta_df);
        console.log(sample_df);
        otuid_data = sample_df[0].otu_ids;
        sample_data = sample_df[0].sample_values;
        otulab_data = sample_df[0].otu_labels;
        maxes = [];
        maxotu=[];
        f = 0;
        sample_data_clone = structuredClone(sample_data);
        while(f < 10){
            max = 0;
            ref = 0;
            for(i in sample_data_clone){
                if (sample_data_clone[i] > max){
                    max = sample_data_clone[i];
                    ref = i;
                }
            }
            maxotu[f] = otuid_data[ref];
            maxes[9-f] = sample_data_clone[ref];
            sample_data_clone[ref] = 0;
            f = f +1;
        }
        max_titles = [];
        for(h in maxes){
            max_titles[9-h] = `OTU ${maxotu[h]}`;
        }
        bardata = [{
                type: 'bar',
                x: sample_data,
                y: otuid_data,
                orientation: 'h'
            }
        ];
        bardata = [{
            type: 'bar',
            x: maxes,
            y: max_titles,
            text:otulab_data,
            orientation: 'h'
        }];
        bubbledata = [{
            mode: 'markers',
            x: otuid_data,
            y: sample_data,
            text: otulab_data,
            marker: { 
                size: sample_data,
                color: otuid_data
            }
        }];
    
        Plotly.newPlot('bar', bardata);
        Plotly.newPlot('bubble', bubbledata);
        d3.select("#sample-metadata").text(`id: ${meta_df[0].id}\n\nethnicity: ${meta_df[0].ethnicity}\n\ngender: ${meta_df[0].gender}\n\nage: ${meta_df[0].age}\n\nlocation: ${meta_df[0].location}\n\nbbtype: ${meta_df[0].bbtype}\n\nwfreq: ${meta_df[0].wfreq}\n`);
    });
}

function checkID(data){
    let dropdown = d3.select("#selDataset").property("value");
    if (data.id == dropdown) {
        return(true);
    }
    else {
        return(false);
    }
}