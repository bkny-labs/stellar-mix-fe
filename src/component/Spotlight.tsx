import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SiOpenai } from "react-icons/si";
import axios from 'axios';
import './Spotlight.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { PiKeyReturn } from "react-icons/pi";

interface SpotlightProps {
  isOpen: boolean;
  toggleSpotlight: () => void;
  updateMoodData: (data: any) => void;
  locked: boolean;
  setLocked: (locked: boolean) => void; 
}

const SpotlightIcon = styled.div`
  margin-right: 8px;
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

const SamplePromptsContainer = styled.div`
  margin-top: 20px;
  color: #fff;
  position: fixed;
  top: 120px;
  left: 30px;
  display: flex;
  flex-direction: column;
`;

const SamplePrompt = styled.button`
  display: block;
  margin: 10px 0;
  background: none;
  border: none;
  color: var(--link-color);
  cursor: pointer;
  text-align: left;
  font-size: 18px;
  line-height: 25px;

  &:hover {
    color: var(--white);
    text-decoration: underline;
  }
`;

const Spotlight: React.FC<SpotlightProps> = ({ isOpen, toggleSpotlight, updateMoodData, locked, setLocked }) => {
  const apiKey = process.env.REACT_APP_OPEN_AI_KEY;
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prompt = `Reply with 10 creative search parameters that are synonymous with my how I am feeling: "${userInput}". Include related genres or artists if mentioned. The response should be comma-separated, with no extra characters, list bullets, numbers, dashes or punctuation.`;
  const initialHistory = [
    "I want to rock out",
    "I'm in a mellow mood",
    "I need some energetic vibes",
    "Feeling a bit nostalgic",
    "I want something new and exciting",
    "Kendrick, J. Cole, Biggie kinda day",
    "Livin on a prayer"
  ];

  const [history, setHistory] = useState<string[]>(() => {
    const storedHistory = JSON.parse(localStorage.getItem('promptHistory') || '[]');
    return storedHistory.length > 0 ? storedHistory : initialHistory;
  });


  const handleSamplePromptClick = (prompt: string) => {
    setUserInput(prompt);
    if (inputRef.current) {
      inputRef.current.value = prompt;
      handleOpenAI();
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('promptHistory');
    setHistory([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleOpenAI();
    }
    if (event.key === 'Escape' && !locked) {
      handleClose();
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

    console.log('user input:', userInput);

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
      localStorage.setItem('moodData', JSON.stringify(sanitizedCompletion.split(',')));
      
      // Update prompt history in localStorage
      const newHistory = [userInput, ...history.slice(0, 6)];
      setHistory(newHistory);
      localStorage.setItem('promptHistory', JSON.stringify(newHistory));

      if (location.pathname !== '/browse') {
        navigate('/browse');
      }

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
      handleClose();
    }
  };

  useEffect(() => {
    const hasUserHistory = history.length > 0;
    const clearButton = document.getElementById('clear-button');

    if (clearButton) {
      clearButton.style.display = hasUserHistory ? 'block' : 'none';
    }

    // Update prompt history when `history` changes
    localStorage.setItem('promptHistory', JSON.stringify(history));
  }, [history]);


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
      <div className={`spotlight-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose }></div>
      <div className={`spotlight-container ${isOpen ? 'open' : ''}`}>
        <SpotlightIcon className='icon'>
          <SiOpenai />
        </SpotlightIcon>
        <SpotlightInput
          className='input'
          ref={inputRef}
          type="text"
          placeholder="How are you feeling right now?"
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="return">
          <PiKeyReturn onClick={handleOpenAI} size={30} />
        </div>

        <MessageArea>
          {loading && <LoadingToast><SiOpenai /> &nbsp; Contacting OpenAI...</LoadingToast>}
          {error && <ErrorToast><SiOpenai /><span>&nbsp;{error}</span></ErrorToast>}
        </MessageArea>

          <SamplePromptsContainer>
            {history.slice(0, 7).map((prompt: string, index: number) => (
              <SamplePrompt key={index} onClick={() => handleSamplePromptClick(prompt)}>
                "{prompt}"
              </SamplePrompt>
            ))}
            {history.length > 0 && (
              <button id="clear-button" className='clearHistory' onClick={handleClearHistory}>Clear History</button>
            )}
          </SamplePromptsContainer>
      </div>
    </>
  );
};

export default Spotlight;
