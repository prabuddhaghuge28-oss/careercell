import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BreadcrumbExp({ header }) {
  const location = useLocation();

  // identifying path 
  let pathnames = location.pathname.split('/').filter(Boolean);
  // user is student, tpo, managemnet
  const userIs = pathnames[0];
  // eliminate 1st word
  pathnames = pathnames.slice(1);
  if (pathnames[0] === "dashboard") {
    pathnames = pathnames.slice(1);
  }
  // console.log(pathnames);

  return (
    <div className="flex justify-between items-center">
      <div className="">
        <span className='text-2xl text-primary-900'>
          {header}
        </span>
      </div>
      <nav aria-label="Breadcrumb" className="hidden md:block">
        <ol className="flex items-center gap-2 text-sm text-primary-700">
          <li>
            <Link to={`/${userIs}/dashboard`} className="no-underline hover:underline text-primary-800">Home</Link>
          </li>
          {pathnames.length > 0 && <li className="text-primary-400">/</li>}
          {pathnames.map((name, index) => {
            let routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            routeTo = `/${userIs}${routeTo}`;

            // If the segment looks like a Mongo ObjectId or a pure numeric id, don't display raw id in breadcrumb.
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(name);
            const isNumericId = /^\d+$/.test(name);
            let label;
            if (name === 'tpo') label = 'TPO';
            else if (isObjectId || isNumericId) label = isLast ? 'Details' : 'Item';
            else label = name.charAt(0).toUpperCase() + name.slice(1);

            return (
              <li key={`${name}-${index}`} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-primary-900">{label}</span>
                ) : (
                  <Link to={routeTo} className="no-underline hover:underline text-primary-700">{label}</Link>
                )}
                {!isLast && <span className="text-primary-400">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export default BreadcrumbExp;