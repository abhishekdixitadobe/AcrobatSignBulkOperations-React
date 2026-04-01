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

import React from 'react';
import DragAndDrop from '../../components/drag-and-drop';
import {Flex, View} from '@adobe/react-spectrum';
import PhotoshopTemplate from '../../components/psd-template';
import Firefall from '../../components/firefall';

const JobConfig = ({onImageDrop}) => {
    return(
        <Flex direction={'row'} justifyContent={'space-between'} width={'100%'}  wrap>
                <View width={350} height={400} padding={10}>
                    <DragAndDrop onImageDrop={onImageDrop}/>
                </View>
                <View width={350} height={400}  padding={10}>
                    <PhotoshopTemplate/>
                </View>
                <View width={350} height={400} padding={10}>
                    <Firefall/>
                </View>
            </Flex>
    );
}
export default JobConfig;