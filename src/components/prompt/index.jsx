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


import {
    Button,
    Flex,
    Text,
    View,
    TextArea
} from '@adobe/react-spectrum';
import React,  {useState} from 'react';
import './styles.css';
import AutomatedSegment from '@spectrum-icons/workflow/AutomatedSegment';
import PromptConfig from './prompt-config';
import { useDispatch } from 'react-redux';
import {setContext} from '../../redux/app';
import { useNavigate } from 'react-router-dom';


const SmartPrompt = ({destination, onContextChange}) => {
    const navigate = useNavigate();
    const [promptString, setPromptString] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [context, setContext] = useState(null);
    const dispatch = useDispatch();

    const handlePromptChange = (payload) => {
        setIsButtonDisabled(false);
        setPromptString(payload.prompt);
        setContext(payload);
    }

    const handleGenerateAction = () => {
        //window.location.href = '/social-post/setup';
        console.log('context:::',context);
        navigate(destination, {state: context});

    }

    return(
        <div style={{
            width: '100%',
            backgroundColor: 'black',
            borderRadius:'10px',
            padding: '10px'
        }} className='smart-prompt-container'>
            <Flex direction={'row'} alignItems={'center'} gap={20} height={100}>
                <View width={'90%'}>
                <Flex direction={'column'}>
                    <div className='prompt-label'>
                        <Text>Prompt</Text>
                        <PromptConfig onContextChange={(prompt) => handlePromptChange(prompt)}/>
                    </div>
                    <TextArea aria-label='prompt' width={'100%'} isQuiet value={promptString} height={'auto'}/>
                </Flex>
                </View>

                <Button variant="accent" style="fill" isDisabled={isButtonDisabled} height={20} onPress={handleGenerateAction}>
                    <AutomatedSegment />
                    <Text>Generate</Text>
                </Button>
            </Flex>
        </div>
    );

}

export default SmartPrompt;
