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
import { style } from "@react-spectrum/s2/style";
import PhotoshopTemplate from '../../components/psd-template';
import Firefall from '../../components/firefall';

const JobConfig = ({onImageDrop}) => {
    return (
        <div
            className={style({
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "full",
                flexWrap: "wrap"
            })}>
            <div
                className={style({
                    width: 350,
                    height: 400,
                    padding: "[10px]"
                })}>
                <DragAndDrop onImageDrop={onImageDrop}/>
            </div>
            <div
                className={style({
                    width: 350,
                    height: 400,
                    padding: "[10px]"
                })}>
                <PhotoshopTemplate/>
            </div>
            <div
                className={style({
                    width: 350,
                    height: 400,
                    padding: "[10px]"
                })}>
                <Firefall/>
            </div>
        </div>
    );
}
export default JobConfig;
