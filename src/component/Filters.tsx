import React from 'react';
import { BiRefresh } from 'react-icons/bi';

interface FilterDrawerProps {
    isOpen: boolean;
  }

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen }) => {

  const drawerStyles = {
    transform: isOpen ? 'translateY(55px)' : 'translateY(-100%)',
    transition: 'transform 0.3s ease-in-out',
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        width: '88%',
        backgroundColor: '#1f1e1e',
        zIndex: 10,
        boxShadow: '3px 0px 3px #000',
        ...drawerStyles
      }}>
        <div className="filters">
            <div className="filter-item">
                <label htmlFor="activities">Current activity: </label>
                <select id="activities" placeholder="Select an activity">
                    <option value="chores">Chores</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="cooking">Cooking</option>
                    <option value="creative_work">Creative Work</option>
                    <option value="driving">Driving</option>
                    <option value="gaming">Gaming</option>
                    <option value="kids">Kids</option>
                    <option value="meditation">Meditation</option>
                    <option value="morning_routine">Morning Routine</option>
                    <option value="outdoor_adventure">Outdoor Adventure</option>
                    <option value="party">Party</option>
                    <option value="pets">Pets</option>
                    <option value="reading">Reading</option>
                    <option value="relax">Relax</option>
                    <option value="romantic_dinner">Romantic Dinner</option>
                    <option value="shopping">Shopping</option>
                    <option value="sleep">Sleep</option>
                    <option value="sports">Sports</option>
                    <option value="study">Study</option>
                    <option value="travel">Travel</option>
                    <option value="work">Work</option>
                    <option value="workout">Workout</option>
                </select>
            </div>
            <div className="filter-item">
                <label htmlFor="language">Language:</label>
                <select id="language">
                    <option value="english">English</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="japanese">Japanese</option>
                    <option value="korean">Korean</option>
                    <option value="italian">Italian</option>
                    <option value="portuguese">Portuguese</option>
                    <option value="spanish">Spanish</option>
                </select>
            </div>
          <div className="filter-item">
                <label htmlFor="sorting">Sort by:</label>
                <select id="sorting">
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>
          <div className="filter-item limit">
            <label htmlFor="limit">Limit:</label>
            <select id="limit">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="50">100</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};