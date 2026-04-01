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
import {Flex, View, Image} from '@adobe/react-spectrum';

const ImageResults = ({images}) => {
    return (
        <Flex direction={'row'} gap={40} wrap width={'100%'}>
            {images.map(entry => {
               let url = '';
               if(entry.image) {
                    url = entry.image.presignedUrl
               } else 
               {
                url = entry
               }
               return (
                <View height={'size-4600'} width={'size-4600'}>
                    <Image src={url}/>
                </View>
               )
               
            })}
        </Flex>
    )
}
export default ImageResults;