// @flow
import React from 'react';
import styled from 'styled-components';

type LanguageSelectOptions = {
  options: Array<{ value: string, label: string }>,
  onChange: (selectedValue: string) => void,
  selectedValue: string,
  selectedLabel: string,
};

const SwitcherContainer = styled.div`
  position: absolute;
  text-align: right;
  bottom: -28px;
  right: 0;
`;

const Switcher = styled.div`
  display: inline-block;
  font-family: sans-serif;
  color: #ccc;
  letter-spacing: 0.05em;
  font-size: 12px;
  padding: 0.3em;
  cursor: pointer;
  position: relative;
`;

const SwitcherSelect = styled.select`
  position: absolute;
  top: 0;
  cursor: pointer;
  opacity: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const renderLanguageSelect = ({
  options,
  onChange,
  selectedValue,
  selectedLabel,
}: LanguageSelectOptions) => (
  <SwitcherContainer>
    <Switcher>
      <SwitcherSelect value={selectedValue} onChange={onChange}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SwitcherSelect>
      <div>
        {selectedLabel || 'Select language...'} {String.fromCharCode(9662)}
      </div>
    </Switcher>
  </SwitcherContainer>
);

export { renderLanguageSelect };
