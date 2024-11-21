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

import React, {useState} from 'react';
import {Flex, View, Image, Checkbox, ActionButton} from '@adobe/react-spectrum';
import { setSelectedBackground } from '../../redux/app';
import { useDispatch } from 'react-redux';

const PreviewResults = ({images, onContinue}) => {
    const dispatch = useDispatch();
    const [selelectedImage, setSelectedImage] = useState(null);

    const handleCheckbox = (input) => {
       setSelectedImage(input);
    }

    const handleContinue = () =>  {
        dispatch(setSelectedBackground(selelectedImage));
        onContinue(selelectedImage);
    }

    return (
        <Flex direction={'column'} gap={60} width={'100%'}>
            <Flex direction={'row'} gap={40} wrap width={'100%'}>
                {images.map(entry => {
                    return (
                        <View height={'size-4600'} width={'size-4600'}>
                            <Flex direction={'column'} gap={10}>
                                <Image src={entry.image.presignedUrl}/>
                                <Checkbox id={entry.image.presignedUrl} onChange={(e) => handleCheckbox(entry.image.presignedUrl)}>Use this image</Checkbox>
                            </Flex>
                        </View>
                    )  
                })}
            </Flex>
            <View>
                <ActionButton onPress={handleContinue}>Continue</ActionButton>
            </View>
        </Flex>
        
    )
}
export default PreviewResults;