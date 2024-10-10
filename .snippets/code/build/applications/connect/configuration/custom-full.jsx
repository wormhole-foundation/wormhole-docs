import WormholeConnect, {
	WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';
import red from '@mui/material/colors/red';
import lightblue from '@mui/material/colors/lightBlue';
import grey from '@mui/material/colors/grey';
import green from '@mui/material/colors/green';
import orange from '@mui/material/colors/orange';

const customTheme: WormholeConnectTheme = {
	mode: 'dark',
	primary: grey,
	secondary: grey,
	divider: 'rgba(255, 255, 255, 0.2)',
	background: {
		default: '#232323',
	},
	text: {
		primary: '#ffffff',
		secondary: grey[500],
	},
	error: red,
	info: lightblue,
	success: green,
	warning: orange,
	button: {
		primary: 'rgba(255, 255, 255, 0.2)',
		primaryText: '#ffffff',
		disabled: 'rgba(255, 255, 255, 0.1)',
		disabledText: 'rgba(255, 255, 255, 0.4)',
		action: orange[300],
		actionText: '#000000',
		hover: 'rgba(255, 255, 255, 0.7)',
	},
	options: {
		hover: '#474747',
		select: '#5b5b5b',
	},
	card: {
		background: '#333333',
		secondary: '#474747',
		elevation: 'none',
	},
	popover: {
		background: '#1b2033',
		secondary: 'rgba(255, 255, 255, 0.5)',
		elevation: 'none',
	},
	modal: {
		background: '#474747',
	},
	font: {
		primary: 'Impact',
		header: 'Impact',
	},
};

export default function App() {
	return <WormholeConnect theme={customTheme} />;
}
