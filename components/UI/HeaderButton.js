import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeaderButton = props => {
    return(
        <HeaderButton {...props} IconComponent={Icon} iconSize={26} color="white" />
    )
}

export default CustomHeaderButton;