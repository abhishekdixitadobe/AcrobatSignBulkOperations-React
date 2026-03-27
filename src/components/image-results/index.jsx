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
import { Image } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";

const ImageResults = ({images}) => {
    return (
        <div
            className={style({
                display: "flex",
                flexDirection: "row",
                gap: 40,
                flexWrap: "wrap",
                width: "full"
            })}>
            {images.map(entry => {
               let url = '';
               if(entry.image) {
                    url = entry.image.presignedUrl
               } else 
               {
                url = entry
               }
               return (
                   <div
                       className={style({
                           height: 368,
                           width: 368
                       })}>
                       <Image src={url}/>
                   </div>
               );
               
            })}
        </div>
    );
}
export default ImageResults;
