import React from 'react';
import './Toggle.css';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id: string;
    label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id, label }) => {
    return (
        <div className="toggle-switch-wrapper">
            {label && <label htmlFor={id} className="toggle-switch__label">{label}</label>}
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    className="toggle-switch__checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <label htmlFor={id} className="toggle-switch__slider"></label>
            </div>
        </div>
    );
};

export default Toggle;
