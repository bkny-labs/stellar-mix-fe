import React, { useEffect, useState } from 'react';
import { getAvailableDevices, transferPlayback } from '../services/spotify-service';
import { Device, DeviceSelectProps } from '../types/spotify.types';
import { MdOutlineSpeakerGroup } from 'react-icons/md';
import './DeviceSelect.css';

const DeviceSelect: React.FC<DeviceSelectProps> = ({ token, dispatch }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const availableDevices = await getAvailableDevices(token, dispatch);
        setDevices(availableDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, [token, dispatch]);

  const handleDeviceChange = async (deviceId: string) => {
    try {
      await transferPlayback(token, dispatch, deviceId);
      console.log('Playback transferred successfully');
      setVisible(false);
    } catch (error) {
      console.error('Error transferring playback:', error);
    }
  };

  const handleSelectDevice = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div className="toolbar-button" onClick={handleSelectDevice}>
        <MdOutlineSpeakerGroup size={25} color="#fff" />
      </div>
      <div className={`device-select-container ${visible ? 'visible' : ''}`}>
        <ul className="device-list">
          {devices.map(device => (
            <li
              key={device.id}
              className="device-list-item"
              onClick={() => handleDeviceChange(device.id)}
            >
              {device.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DeviceSelect;