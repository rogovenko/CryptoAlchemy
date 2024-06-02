import React, { useEffect, ReactNode, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/usePlayerContext';
import { getItems } from '../utils';

interface RedirectWrapperProps {
  children: ReactNode;
}

const RedirectWrapper: React.FC<RedirectWrapperProps> = memo(({ children }) => {
  const { inventory } = usePlayer();
  const navigate = useNavigate();
  const amounts = getItems(inventory).map((itemProp) => itemProp.amount);

  useEffect(() => {
    amounts.forEach((amount) => {
      if (amount !== -1) {
        navigate("/farm");
      }
    });
  }, [amounts, navigate]);

  return <>{children}</>;
});

export default RedirectWrapper;
