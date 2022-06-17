import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createGame } from './hostSlice';

const CreateGame = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createGame());
  }, [dispatch]);

  return <h2>Creating game...</h2>;
};

export default CreateGame;