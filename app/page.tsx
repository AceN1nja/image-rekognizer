'use client';

import React, {ChangeEvent} from "react";
import Slider from '@mui/material/Slider';
import Switch from "@mui/material/Switch";
import Dropzone from "react-dropzone";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {FixedSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import dotenv from "dotenv";
dotenv.config();

import AWS from "aws-sdk";
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIARK4VAUKYVWVYBGMN";
AWS.config.secretAccessKey = "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";
AWS.config.region = "ap-southeast-2";

const Rekognition = new AWS.Rekognition();

//convert file to byte array
// @ts-ignore
const fileToByteArray = async (file) => {
    return await file.arrayBuffer();
}







export default function Home() {
    //slider states
    const [confidence, setConfidence] = React.useState(80);
    const [facialAnalysis, setFacialAnalysis] = React.useState(false);
    const [labels, setLabels] = React.useState(5);

    //labels state
    const [labelList, setLabelList] = React.useState([]);

    //slider on change
    const handleConfidenceChange = (event: Event, newValue: number | number[]) => {
        setConfidence(newValue as number);
    }
    const handleFacialAnalysisChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFacialAnalysis(checked as boolean);
    }
    const handleLabelsChange = (event: Event, newValue: number | number[]) => {
        setLabels(newValue as number);
    }

    //size bytes helper JSCompress
    // @ts-ignore
    function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}


    const [image, setImage] = React.useState(new File([], "placeholder", {type: "image/png"}));
    const getImageComponent = () => {
        if (image) {
            return (
                <img className={"max-h-full max-w-full object-cover "} src={URL.createObjectURL(image)} alt={"placeholder"}/>
            )
        }
        return (
            <p className={"text-center"}> Choose an image </p>
        )
    }

    // @ts-ignore
    const listLabels = (labels) => {
        // @ts-ignore
        //returnss a fixedsize list of listiems containing all the labbelss
        return (
            <AutoSizer>
                {({height, width}) => (
                    <FixedSizeList height={height} width={width} itemSize={46} itemCount={labels.length} className={"p-0"}>
                        {({index, style}) => (
                            <ListItem className={"style"}  style={style}>
                                {labels[index].Name} - {labels[index].Confidence.toFixed(2)}%
                            </ListItem>
                        )}

                    </FixedSizeList>
                )}
            </AutoSizer>
        )
    }

    // @ts-ignore
    const onDrop = (e) => {
        console.log(e[0]);
        fileToByteArray(e[0]).then((data) => {
            console.log(data);

            //fetch rekognition response
            Rekognition.detectLabels({
                Image: {
                    Bytes: data
                }
            }).promise().then(
                (data) => {
                    console.log(data);
                    setLabelList(data.Labels);
                }
            ).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);

        });
        setImage(e[0]);
    }


  // @ts-ignore
    return (
    <main className={"flex flex-col w-screen h-screen border border-amber-50"}>
        <h1 className={"text-5xl text-center w-full border-blue-600 border "}>Image Rekognizer</h1>
        <div className={"flex flex-row flex-wrap h-[10%] justify-evenly border border-green-600"}>
            <div className={"flex flex-row w-1/4 border border-red-600 justify-evenly items-center"}>
                <h6 className={"text-2xl text-left"}>Confidence</h6>
                <Slider
                    onChange={handleConfidenceChange}
                    className={"w-3/5"}
                    aria-label="Confidence"
                    defaultValue={80}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(x) => { return x + "%"}}
                    />
            </div>
            <div className={"flex flex-row w-1/4 border border-red-600 justify-evenly items-center"}>
                <h6 className={"text-2xl text-left"}>Facial Analysis</h6>
                <Switch
                   size={"medium"}
                   onChange={handleFacialAnalysisChange}

                />
            </div>
            <div className={"flex flex-row w-1/4 border border-red-600 justify-evenly items-center"}>
                <h6 className={"text-2xl text-left"}>Labels</h6>
                <Slider
                    className={"w-3/5"}
                    aria-label="Confidence"
                    defaultValue={5}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    onChange={handleLabelsChange}

                />
            </div>
        </div>

        <div className={"flex flex-row flex-wrap flex-1 border border-green-600"}>
            <div className={"flex flex-col w-1/2 border border-yellow-600 items-center"}>
                <div className={"h-[85%] w-full border border-amber-100 flex flex-col justify-center items-center"}>
                    {getImageComponent()}
                </div>
                <div className={"flex flex-row w-full h-[15%] border border-amber-100 justify-stretch items-center"}>
                    <Dropzone onDrop={onDrop}>
                        {({getRootProps, getInputProps}) => (
                            <section className="container h-full w-1/2">
                                <div {...getRootProps({className: 'dropzone flex flex-col justify-center items-center w-full h-full'})}>
                                    <input className={"w-full h-full "} {...getInputProps()} />
                                    <p className={" items-center justify-center"}>Drop or Click to select Images</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    <List className={"flex flex-col w-1/2"}>
                        <ListItem>Name: {image.name}</ListItem>
                        <ListItem>Extension: {image.type}</ListItem>
                        <ListItem>Test: {formatBytes(image.size)}</ListItem>
                    </List>

                </div>

            </div>

            <div className={"flex flex-col w-1/2 border border-violet-600"}>
                {listLabels(labelList)}
            </div>
        </div>

    </main>
  )
}
