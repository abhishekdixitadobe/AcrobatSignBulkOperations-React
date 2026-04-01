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

import { Flex, TextArea, View, TagGroup, Item, Text, Button, Switch } from '@adobe/react-spectrum';
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

    return(
        <div style={{
            backgroundColor: 'black',
            borderRadius:'10px',
            padding: '20px',
            height: '95%'
        }} className='properties-container'>
            <Flex direction={'column'} gap={20} width={'size-3400'}  alignItems={'center'}>
                <View width={'80%'}>
                    <TextArea label='Prompt' isQuiet value={prompt ? prompt : ''} isReadOnly aria-label='prompt'/>
                </View>
                <View  width={'80%'}>
                    <TextArea label='Product' isQuiet value={productName ? productName : ''} isReadOnly aria-label='product'/>
                </View>
                <View width={'80%'}>
                    <Text>Audiences</Text>
                    <TagGroup items={audience} aria-label='audience'>
                        {item => <Item>{item.name}</Item>}
                    </TagGroup>
                </View>
                <View width={'80%'}>
                    <Text>Regions</Text>
                    <TagGroup items={region} aria-label='region'>
                        {item => <Item>{item.name}</Item>}
                    </TagGroup>
                </View>
                <View width={'80%'}>
                    <Switch>Enable x-ray</Switch>
                </View>
                <View width={'80%'}>

                    <Button variant="accent" style="fill" onPress={onExecute}>
                        <Text>Generate</Text>
                    </Button>
                </View>
            </Flex>
        </div>
    )
}

export default PropertyRail;
