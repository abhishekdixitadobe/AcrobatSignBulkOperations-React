/* ************************************************************************
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

import React from "react";

export const AdobeIcon = ({
    width = '240',
    height = '234',
    strokeColor = `stroke-current`,
    strokeWidth = '2',
    fillColor = '#fa0f00',
    fillColor2 = `fill-primary`,
    rotateCenter = 0,
    className = ` antialiased w-svgIcon max-w-svgIcon`,
    className2 = ` stroke-current`,
    className3 = ` fill-primary`
}) => {
    return (
        <svg
            data-name="Layer 1"
            viewBox="0 0 240 234"
            xmlns="http://www.w3.org/2000/svg">
            <rect
                height={height}
                rx="42.5"
                width={width}
                fill={fillColor} />
            <path
                d="M186.617 175.95h-28.506a6.243 6.243 0 01-5.847-3.769l-30.947-72.359a1.364 1.364 0 00-2.611-.034L99.42 145.731a1.635 1.635 0 001.506 2.269h21.2a3.27 3.27 0 013.01 1.994l9.281 20.655a3.812 3.812 0 01-3.507 5.301H53.734a3.518 3.518 0 01-3.213-4.904l49.09-116.902A6.639 6.639 0 01105.843 50h28.314a6.628 6.628 0 016.232 4.144l49.43 116.902a3.517 3.517 0 01-3.202 4.904z"
                data-name="256"
                fill="#fff" />
        </svg>

    );
};
