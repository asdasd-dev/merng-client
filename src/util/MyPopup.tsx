import React from 'react'
import { Popup, PopupProps } from 'semantic-ui-react'

export const MyPopup: React.FC<PopupProps> = ({...props}) => {
    return <Popup {...props} inverted />
}