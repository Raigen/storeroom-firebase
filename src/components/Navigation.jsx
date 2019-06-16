import { LANDING, ROOMLIST } from '../constants/routes'

import { Link } from 'react-router-dom'
import React from 'react'

export const Navigation = () => (
  <ul>
    <li>
      <Link to={LANDING}>Home</Link>
    </li>
    <li>
      <Link to={ROOMLIST}>Liste</Link>
    </li>
  </ul>
)
