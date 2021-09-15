import React from 'react';
import { useSelector } from 'react-redux';
import { selectRole } from './playerSlice';

const Role = () => {
  const role = useSelector(selectRole);

  return (
    <div>
      You are a {role}.
    </div>
  )
}

export default Role;