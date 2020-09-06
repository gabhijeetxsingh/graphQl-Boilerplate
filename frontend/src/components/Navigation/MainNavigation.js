import React from 'react';
import {NavLink} from 'react-router-dom';
import "./mainNavigation.css"

const mainNavigation = (props) => (
    
     <header className="main-navigation">
    <div className="main-navigation__logo">
    <h1>Easy Event</h1>
    </div>
    <nav className="main-navigation__items">
        <ul>
            <li>
                <NavLink to="/">Events</NavLink>
            </li>
        </ul>
    </nav>
</header>
);

export default mainNavigation;