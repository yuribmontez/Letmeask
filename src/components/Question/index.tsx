import { ReactNode } from 'react';
import cx from 'classnames'
import './styles.scss'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
    theme?: 'light' | 'dark';
}

export function Question({content, author, isAnswered = false, isHighlighted = false, children, theme}: QuestionProps) {
    return (
        <div 
          className={cx(
              `question ${theme}`, 
              { answered : isAnswered }, 
              { highlighted : isHighlighted && !isAnswered },
          )}
        >
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
}