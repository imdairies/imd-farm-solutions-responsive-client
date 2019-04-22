export default {
  items: [
    {
      name: 'Administration',
      url: '/base',
      icon: 'icon-settings',
      children: [
        {
          name: 'Lifecycle Events',
          url: '/base/forms',
          icon: 'icon-user',
        },
        {
          name: 'Lookup',
          url: '/admin/lookup/search',
          icon: 'icon-list',
        },
        {
          name: 'Sire',
          url: '/admin/sire/search',
        },
      ],
    },
    {  
      name: 'Animal',
      url: '/base',
      icon: 'icon-user',
      children: [
        {
          name: '360° View',
          url: '/animal/search',
        },
        {
          name: 'Event',
          url: '/animal/event/search',
        },
        {
          name: 'Milking',
          url: '/animal/milking/search',
        },
      ],
    },
    {  
      name: 'Farm',
      url: '/base',
      icon: 'icon-home',
      children: [
        {
          name: 'Event',
          url: '/farm/event/add',
        },
        {
          name: 'Milking',
          url: '/farm/milking/add',
        },
        {
          name: 'Insemination',
          url: '/farm/insemination',
        }
      ],
    },
  ],
};
