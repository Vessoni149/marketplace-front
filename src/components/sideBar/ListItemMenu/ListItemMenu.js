import React from 'react';
import './listItemMenu.css';
export function ListItemMenu({itemList}) {
    

    return (
        <li className='li-nav-bars'>
            <div className='list-item-container'>
                <p className='p-list-item'>{itemList}</p>
                <span className='span-list-arrow'>&gt;</span>
            </div> 
        </li>
    )
}
