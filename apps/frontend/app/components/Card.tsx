

interface CardProps {
    title: string;
    Link: string;
    
  }
  

  export function Card({ title, Link }: CardProps) {
    return (
      <div className="p-8 bg-white rouded-md border-gray-200 max-w-96">
        <div className="flex justify-between">
          <div className="flex items-center text-md">
            <div className="text-gray-500">
             {title}
            </div>
          </div>
  
          <div className="flex">
            <div className="pr-2 text-gray-500">
           {Link}
            </div>
          </div>
        </div>
      </div>
    );
  }