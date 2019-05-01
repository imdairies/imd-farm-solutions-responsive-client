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
          icon: 'icon-globe'
        },
        {
          name: 'Event',
          url: '/animal/event/search',
          icon: 'icon-bell'
        },
        {
          name: 'Milking',
          url: '/animal/milking/search',
          icon: 'icon-drop'
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
          icon: 'icon-bell'
        },
        {
          name: 'Milking',
          url: '/farm/milking/add',
          icon: 'icon-drop'
        },
        {
          name: 'Insemination',
          url: '/farm/insemination',
        }
      ],
    },
    {  
      name: 'Inventory',
      url: '/base',
      icon: 'icon-basket-loaded',
      children: [
        {
          name: 'Semen',
          url: '/inventory/sire/addsemeninventory',
        //  icon: 'fa-address-book'
        }
      ],
    },
  ],
};
