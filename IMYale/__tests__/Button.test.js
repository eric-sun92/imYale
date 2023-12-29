import React from 'react';
import RedButton from '../navigation/components/Button';
import { render } from '@testing-library/react-native';

describe('Button', () => {
    const sampleProps = {
        title: "Sample Button",
        onPress: () => {}, 
    }

    it('should render successfully', () => {
        const { getByText } = render(
            <RedButton 
                title={sampleProps.title}
                onPress={sampleProps.onPress}
            />
        )
        expect(getByText(sampleProps.title)).toBeTruthy();
    });
});