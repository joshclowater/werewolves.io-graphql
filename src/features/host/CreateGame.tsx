import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createGame } from './hostSlice';

const CreateGame = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createGame());
  }, [dispatch]);

  return <div>Creating game...</div>;
};

export default CreateGame;