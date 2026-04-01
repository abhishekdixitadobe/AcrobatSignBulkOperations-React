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

import { ToastQueue } from "@react-spectrum/toast";

/**
 * Connected to the React-Spectrum toast component to gracefully display error to the user.
 * @param {string} message 
 */
const displayError = (message) => {
    ToastQueue.negative(message, {timeout: 5000});
} 

export const handleError = (message) => {
    console.log(message);
    displayError(message);
}