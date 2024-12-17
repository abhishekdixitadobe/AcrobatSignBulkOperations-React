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

import { Flex, Heading, Text , ProgressCircle, Dialog, DialogContainer, Content} from '@adobe/react-spectrum';
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

    return(
        <Flex direction={'column'} width={'100%'} height={'100%'} alignItems={'center'}>
           <Flex direction={'row'} width={'100%'} alignItems={'center'}>
           <DialogContainer onDismiss={()=> setIsRunning(false)}>
                {isRunning && <Dialog size='M'>
                    <Content>
                        <Flex direction='column' alignItems='center' height='100%' width='100%' gap='size-100'>
                            <ProgressCircle size='L' aria-label="Hold on, magic is happening…" isIndeterminate/>
                            <Text>Hold on, magic is happening…</Text>
                            <Heading level={1}>{action}</Heading>
                        </Flex>
                    </Content>
                </Dialog>}
            </DialogContainer>
            {showPreview ? 
                <PreviewResults images={previewImages} onContinue={onContinue}/>
            : null }
            {showResults.length > 0 ?
                <ImageResults images={showResults}/>
            : null}
           </Flex>
        </Flex>
    );
}

export default ProcessingView;