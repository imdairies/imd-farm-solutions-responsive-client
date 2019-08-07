import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));

const IMDEditLifecycleEventCode = React.lazy(() => import('./views/Base/IMDForms/IMDEditLifecycleEventCode'));
const IMDAddLifecycleEventCode = React.lazy(() => import('./views/Base/IMDForms/IMDAddLifecycleEventCode'));

const AddAnimal = React.lazy(() => import('./views/Animal/Add'));
const UpdateAnimal = React.lazy(() => import('./views/Animal/Update'));
const SearchAnimal = React.lazy(() => import('./views/Animal/Search'));

const AddLookup    = React.lazy(() => import('./views/Admin/Lookup/Add'));
const UpdateLookup = React.lazy(() => import('./views/Admin/Lookup/Update'));
const SearchLookup = React.lazy(() => import('./views/Admin/Lookup/Search'));

const UploadMilkRecord    = React.lazy(() => import('./views/Admin/MilkingRecord/Upload'));

const SearchFeedPlan    = React.lazy(() => import('./views/Admin/FeedPlan/Search'));
const AddFeedPlan    = React.lazy(() => import('./views/Admin/FeedPlan/Add'));


 
const SearchAnimalEvent = React.lazy(() => import('./views/Animal/Event/Search'));
const AddAnimalEvent    = React.lazy(() => import('./views/Animal/Event/Add'));
const UpdateAnimalEvent = React.lazy(() => import('./views/Animal/Event/Update'));


const ViewMilking = React.lazy(() => import('./views/Animal/Milking/View'));
const SearchAnimalMilking = React.lazy(() => import('./views/Animal/Milking/Search'));
const AddDailyMilk = React.lazy(() => import('./views/Animal/Milking/Add'));


const AddFarmDailyMilk = React.lazy(() => import('./views/Farm/Milking/Add'));
const AddFarmEvent = React.lazy(() => import('./views/Farm/Event/Add'));
const ViewInseminationInfo = React.lazy(() => import('./views/Farm/Insemination'));


const SearchSire = React.lazy(() => import('./views/Admin/Sire/Search'));
const AddSire    = React.lazy(() => import('./views/Admin/Sire/Add'));

const AddSemenInventory    = React.lazy(() => import('./views/Inventory/Sire/AddSemenInventory'));
const SearchSemenInventory    = React.lazy(() => import('./views/Inventory/Sire/Search/SearchSemenInventory'));

const FarmFeedListing = React.lazy(() => import('./views/Farm/Feed/Listing'));



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/IMDAddLifecycleEventCode', name: 'IMDAddLifecycleEventCode', component: IMDAddLifecycleEventCode },
  { path: '/base/IMDEditLifecycleEventCode', name: 'IMDEditLifecycleEventCode', component: IMDEditLifecycleEventCode },
  
  { path: '/animal/add', name: 'AddAnimal', component: AddAnimal },
  { path: '/animal/update', name: 'UpdateAnimal', component: UpdateAnimal },
  { path: '/animal/search', name: 'SearchAnimal', component: SearchAnimal },

  { path: '/admin/lookup/add', name: 'AddLookup', component: AddLookup },
  { path: '/admin/lookup/update', name: 'UpdateLookup', component: UpdateLookup },
  { path: '/admin/lookup/search', name: 'SearchLookup', component: SearchLookup },

  { path: '/admin/milkingrecord/upload', name: 'UploadMilkRecord', component: UploadMilkRecord },

  { path: '/admin/feedplan/search', name: 'SearchFeedPlan', component: SearchFeedPlan },
  { path: '/admin/feedplan/add', name: 'AddFeedPlan', component: AddFeedPlan }, 

  { path: '/admin/sire/search/', name: 'SearchSire', component: SearchSire },
  { path: '/admin/sire/add/'   , name: 'AddSire'   , component: AddSire    },

  { path: '/animal/event/search', name: 'SearchAnimalEvent', component: SearchAnimalEvent },
  { path: '/animal/event/add', name: 'AddAnimalEvent', component: AddAnimalEvent },
  { path: '/animal/event/update', name: 'UpdateAnimalEvent', component: UpdateAnimalEvent },

  { path: '/animal/milking/view', name: 'ViewMilking', component: ViewMilking },
  { path: '/animal/milking/add', name: 'AddDailyMilk', component: AddDailyMilk },
  { path: '/animal/milking/search', name: 'AddDailyMilk', component: SearchAnimalMilking },

  { path: '/farm/event/add', name: 'AddFarmEvent', component: AddFarmEvent },
  { path: '/farm/milking/add', name: 'AddFarmDailyMilk', component: AddFarmDailyMilk },
  { path: '/farm/insemination', name: 'ViewInseminationInfo', component: ViewInseminationInfo },


  { path: '/inventory/sire/addsemeninventory', name: 'AddSemenInventory', component: AddSemenInventory },
  { path: '/inventory/sire/search/searchsemenInventory', name: 'SearchSemenInventory', component: SearchSemenInventory},

  { path: '/farm/feed/listing', name: 'FarmFeedListing', component: FarmFeedListing },
  

];

export default routes;
