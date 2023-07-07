'use client';

import React, {SetStateAction} from "react";
import Slider from '@mui/material/Slider';
import Switch from "@mui/material/Switch";
import Dropzone from "react-dropzone";


import {StaticImageData} from "next/image";




export default function Home() {
    const [image, setImage] = React.useState(null);
    const getImageComponent = () => {
        if (image) {
            return (
                <img className={"max-h-full max-w-full object-cover "} src={URL.createObjectURL(new Blob([image]))} alt={"placeholder"}/>
            )
        }
        return (
            <p className={"text-center"}> Choose an image </p>
        )
    }

    // @ts-ignore
    const onDrop = (e) => {
        console.log(e[0]);
        setImage(e[0]);
    }


  return (
    <main className={"flex flex-col w-screen h-screen border border-amber-50"}>
        <h1 className={"text-5xl text-center w-full border-blue-600 border "}>Image Rekognizer</h1>
        <div className={"flex flex-row flex-wrap h-[10%] justify-evenly border border-green-600"}>
            <div className={"flex flex-row w-1/4 border border-red-600 justify-evenly items-center"}>
                <h6 className={"text-2xl text-left"}>Confidence</h6>
                <Slider
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

                </div>

            </div>

            <div className={"flex flex-col w-1/2 border border-violet-600 items-center"}>
            </div>
        </div>

    </main>
  )
}
