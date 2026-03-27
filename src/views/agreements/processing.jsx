/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
**************************************************************************/

import { Heading, Text, ProgressCircle, Dialog, DialogContainer, Content } from "@react-spectrum/s2";

import { style } from "@react-spectrum/s2/style";
import React, { useEffect, useState } from 'react';
import ImageResults from '../../components/image-results';
import { useSelector } from 'react-redux';
import PreviewResults from '../../components/preview';

const ProcessingView = ({onContinue}) => {
    const logEntryList = useSelector((state) => state.app.logEntries);
    const selectedBackground = useSelector((state) => state.app.selectedBackground);

    const [isRunning, setIsRunning] = useState(false);
    const [action, setAction] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewImages, setPreviewImages] = useState(null);



    useEffect(() => {
        setIsRunning(true);
        if(logEntryList.length > 0) {
            const lastEvent = logEntryList[logEntryList.length-1];
            setAction(lastEvent.name);
            setActionStatus(lastEvent.status);

            const result = [];
            logEntryList.map(entry => {
                const fragment = createLogEntry(entry);
                result.push(fragment)
            });
            setLogEntries(result);

            if(lastEvent.status === 'PREVIEW') {
                setIsRunning(false);
                setPreviewImages(lastEvent.payload.value);
                setShowPreview(true);
            }
            if(lastEvent.status === 'COMPLETE') {
                setIsRunning(false);
                setShowPreview(false);
                setShowResults(lastEvent.payload.value);
            }
        }  
    },[logEntryList, selectedBackground]);

    return (
        <div
            className={style({
                display: "flex",
                flexDirection: "column",
                width: "full",
                height: "full",
                alignItems: "center"
            })}>
            <div
                className={style({
                    display: "flex",
                    flexDirection: "row",
                    width: "full",
                    alignItems: "center"
                })}>
            <DialogContainer onDismiss={()=> setIsRunning(false)}>
                 {isRunning && <Dialog size='M'>
                     <Content>
                         <div
                             className={style({
                                 display: "flex",
                                 flexDirection: "column",
                                 alignItems: "center",
                                 height: "full",
                                 width: "full",
                                 gap: 8
                             })}>
                             <ProgressCircle size='L' aria-label="Hold on, magic is happening…" isIndeterminate/>
                             <Text>Hold on, magic is happening…</Text>
                             <Heading level={1}>{action}</Heading>
                         </div>
                     </Content>
                 </Dialog>}
             </DialogContainer>
             {showPreview ? 
                 <PreviewResults images={previewImages} onContinue={onContinue}/>
             : null }
             {showResults.length > 0 ?
                 <ImageResults images={showResults}/>
             : null}
            </div>
        </div>
    );
}

export default ProcessingView;
