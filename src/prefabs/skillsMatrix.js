(() => ({
  name: 'Employee Skill Matrix',
  icon: 'DataContainer',
  category: 'TABLE',
  structure: [
    {
      name: 'skillsMatrix',
      options: [
        {
          type: 'MODEL',
          label: 'Model',
          key: 'modelId',
          value: '',
        },
        {
          type: 'FILTER',
          label: 'Filter',
          key: 'filter',
          value: {},
          configuration: {
            dependsOn: 'modelId',
          },
        },
      ],
      descendants: [],
    },
  ],
}))();
