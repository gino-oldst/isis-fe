// @flow
import React from 'react';
import './notfound.scss';
import { Link } from 'react-router-dom';

export default function NotFoundScreen(): React$Element<"div"> {
    return (
        <div className='notfound d-flex justify-content-center align-items-center w-100'>
            <div className='text-center'>
                <h1>404</h1>
                <h3 className='text-secondary mt-4'>Page Not Found</h3>
                <p className='text-secondary mt-3'>
                    The Page you are looking for doesn't exist.
                </p>
                <Link to='/'>Back to Home</Link>
            </div>
        </div>
    );
}
