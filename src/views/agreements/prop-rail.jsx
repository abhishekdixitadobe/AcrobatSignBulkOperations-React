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

import { Tag, TextArea, TagGroup, Text, Button, Switch } from "@react-spectrum/s2";

import { style } from "@react-spectrum/s2/style";
import React, { useEffect, useState } from 'react';
import { audienceArray,productArray, regionArray, getObjectsFromArray, getName } from '../../utils/data';
import { setRegions, setSegments } from '../../redux/app';
import { useDispatch } from 'react-redux';

const PropertyRail = ({context, onExecute}) => {

    const dispatch = useDispatch();

    const [prompt, setPrompt] = useState('');
    const [audience, setAudience] = useState([]);
    const [region, setRegion] = useState([]);
    const [productName, setProductName] = useState('');

    useEffect(() => {
        const selectedAudiences = Array.from(context.audiences);
        const selectedRegions = Array.from(context.regions);

        const audienceList = getObjectsFromArray(audienceArray, selectedAudiences);
        dispatch(setSegments(audienceList));
        setAudience(audienceList);

        const regionList = getObjectsFromArray(regionArray, selectedRegions);
        setRegion(regionList);
        dispatch(setRegions(regionList));

        const name = getName(productArray, context.product);
        setProductName(name);
        setPrompt(context.prompt)


    },[context]);

    return (
        <div style={{
            backgroundColor: 'black',
            borderRadius:'10px',
            padding: '20px',
            height: '95%'
        }} className='properties-container'>
            <div
                className={style({
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    width: 272,
                    alignItems: "center"
                })}>
                <div className={style({
                    width: "[80%]"
                })}>
                    <TextArea
                        label='Prompt'
                        value={prompt ? prompt : ''}
                        isReadOnly
                        aria-label='prompt' />
                </div>
                <div  className={style({
                    width: "[80%]"
                })}>
                    <TextArea
                        label='Product'
                        value={productName ? productName : ''}
                        isReadOnly
                        aria-label='product' />
                </div>
                <div className={style({
                    width: "[80%]"
                })}>
                    <Text>Audiences</Text>
                    <TagGroup items={audience} aria-label='audience'>
                        {item => <Tag>{item.name}</Tag>}
                    </TagGroup>
                </div>
                <div className={style({
                    width: "[80%]"
                })}>
                    <Text>Regions</Text>
                    <TagGroup items={region} aria-label='region'>
                        {item => <Tag>{item.name}</Tag>}
                    </TagGroup>
                </div>
                <div className={style({
                    width: "[80%]"
                })}>
                    <Switch>Enable x-ray</Switch>
                </div>
                <div className={style({
                    width: "[80%]"
                })}>

                    <Button variant="accent" fillStyle="fill" onPress={onExecute}>
                        <Text>Generate</Text>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PropertyRail;
