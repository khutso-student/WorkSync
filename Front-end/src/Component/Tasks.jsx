export default function Tasks({ completedProjects }) {
  return (
    <div className="p-4">
          <div className="mb-5">
            <h1 className="text-2xl sm:3xl font-bold text-[#383838]">Completed Tasks</h1>
            <p className="text-sm text-[#525050]">
              Total Number of completed projects <span>{completedProjects.length}</span>
            </p>
        </div>

      {completedProjects.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded shadow-sm">
          No completed tasks available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {project.description || 'No description provided.'}
              </p>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
