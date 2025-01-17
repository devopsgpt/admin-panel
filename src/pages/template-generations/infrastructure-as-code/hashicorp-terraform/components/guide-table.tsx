import { FC } from 'react';

type GuideTableProps = {
  guide: { resource: string; name: string }[];
};

export const GuideTable: FC<GuideTableProps> = ({ guide }) => {
  return (
    <div className="absolute left-full top-0 z-50 ml-4 w-fit rounded-lg bg-gray-700 p-4">
      <table>
        <thead>
          <tr>
            <th>Resource</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {guide.map((resource) => (
            <tr>
              <td className="pr-4">{resource.resource}</td>
              <td>{resource.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
