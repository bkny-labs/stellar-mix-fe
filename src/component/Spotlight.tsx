import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SiOpenai } from "react-icons/si";
import axios from 'axios';
import './Spotlight.css';

interface SpotlightProps {
  isOpen: boolean;
  toggleSpotlight: () => void;
  updateMoodData: (data: any) => void;
}

const SpotlightIcon = styled.div`
  margin-right: 8px;
  font-size: 20px;
  color: #fff;
  display: flex;
`;

const SpotlightInput = styled.input`
  width: 100%;
  font-size: 20px;
  line-height: 1.5;
  letter-spacing: 0.5px;
  border: none;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  background: #1d1d1d;
  color: #fff;
`;

const MessageArea = styled.div`
  position: fixed;
  top: 60px;
  margin-top: 20px;
  color: #fff;
`;

const LoadingToast = styled.p`
  display: flex;
  align-items: center;
`;

const ErrorToast = styled.p`
  display: flex;
  align-items: center;
  color: red;
`;

const Spotlight: React.FC<SpotlightProps> = ({ isOpen, toggleSpotlight, updateMoodData }) => {
  const apiKey = process.env.REACT_APP_OPEN_AI_KEY;
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prompt = `Reply with 10 creative and interesting search parameters that are synonymous with my feelings: "${userInput}". Also include related genres or artists if mentioned. The response should be comma-separated, with no extra characters, list bullets, numbers, or punctuation.`;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleOpenAI();
    }
  };

  const handleClose = () => {
    setLoading(false);
    toggleSpotlight();
  };

  const handleOpenAI = async () => {
    if (!apiKey) {
      console.error('API key is missing');
      setError('API key is missing');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a Spotify playlist search master.',
        },
        {
          role: 'user',
          content: prompt,

        },
      ];

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 200,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      const sanitizeCompletion = (completion: string) => {
        return completion
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0)
          .join(', ');
      };

      const completion = response.data.choices[0].message.content.trim();

      const sanitizedCompletion = sanitizeCompletion(completion);
      updateMoodData(sanitizedCompletion.split(',').map(item => item.trim()));

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          setError('Rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 401) {
          setError('Unauthorized: Check your API key and permissions.');
        } else {
          setError('Error fetching data from OpenAI.');
        }
        console.error('Error fetching completion from OpenAI:', error);
      } else {
        setError('Unexpected error occurred.');
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
      isOpen = false;
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.value) {
        inputRef.current.select();
      }
    }
  }, [isOpen]);

  return (
    <>
      <div className={`spotlight-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}></div>
      <div className={`spotlight-container ${isOpen ? 'open' : ''}`}>
        <SpotlightIcon>
          <SiOpenai />
        </SpotlightIcon>
        <SpotlightInput
          ref={inputRef}
          type="text"
          placeholder="How are you feeling right now?"
          onChange={(e) => setUserInput(e.target.value)}
        />
        <MessageArea>
          {loading && <LoadingToast><SiOpenai /> &nbsp; Contacting OpenAI...</LoadingToast>}
          {error && <ErrorToast><SiOpenai /><span>&nbsp;{error}</span></ErrorToast>}
        </MessageArea>
      </div>
    </>
  );
};

export default Spotlight;
