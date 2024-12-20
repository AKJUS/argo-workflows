import {Autocomplete} from 'argo-ui/src/components/autocomplete/autocomplete';
import React, {useState} from 'react';

import './input-filter.scss';

interface InputProps {
    value: string;
    placeholder?: string;
    name: string;
    onChange: (input: string) => void;
    filterSuggestions?: boolean;
    autoHighlight?: boolean;
}

export function InputFilter(props: InputProps) {
    const [value, setValue] = useState(props.value);
    const [localCache, setLocalCache] = useState((localStorage.getItem(props.name + '_inputs') || '').split(',').filter(item => item !== ''));

    function setValueAndCache(newValue: string) {
        setLocalCache(currentCache => {
            const updatedCache = [...currentCache];
            if (!updatedCache.includes(newValue)) {
                updatedCache.unshift(newValue);
            }
            while (updatedCache.length > 5) {
                updatedCache.pop();
            }
            localStorage.setItem(props.name + '_inputs', updatedCache.join(','));
            return updatedCache;
        });
        setValue(newValue);
    }

    function renderInput(inputProps: React.HTMLProps<HTMLInputElement>) {
        return (
            <input
                {...inputProps}
                onKeyUp={event => {
                    if (event.keyCode === 13) {
                        setValueAndCache(event.currentTarget.value);
                        props.onChange(value);
                    }
                }}
                className='argo-field'
                placeholder={props.placeholder}
            />
        );
    }

    return (
        <div className='input-filter'>
            <Autocomplete
                items={localCache}
                value={value}
                onChange={(e, newValue) => setValue(newValue)}
                onSelect={newValue => {
                    setValue(newValue);
                    props.onChange(newValue);
                }}
                renderInput={renderInput}
                filterSuggestions={props.filterSuggestions}
                autoHighlight={props.autoHighlight}
            />
            <a
                onClick={() => {
                    setValue('');
                    props.onChange('');
                }}>
                <i className='fa fa-times-circle' />
            </a>
        </div>
    );
}
