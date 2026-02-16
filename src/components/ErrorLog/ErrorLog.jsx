import React from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const ERROR_LOG_TEXT_CLASS = "text-sm";

export class ErrorLog extends React.Component {

	constructor(props) {
		super(props);

		this.state = ({
			collapse: false,
		});

		// this.copyErrors = this.copyErrors.bind(this);
		// this.expand = this.expand.bind(this);
		// this.toggleCollapseLog = this.toggleCollapseLog.bind(this);
	}

	copyErrors = () => {
		const {
			dialog,
			errors = [],
		} = this.props;

		let errorList = '';
		errors.forEach((error) => {
			const {
				action,
				message,
				statusCode,
				statusText,
			} = error;
			errorList += `${action}\t${message}\t${statusCode}\t${statusText}\n`;
		});

		this.copyTextToClipboard(errorList)
			.then(() => {
				dialog("Error log copied to clipboard");
			})
			.catch ((error) => {
				console.log("Copy to clipboard", error); // eslint-disable-line
			});
	};

	copyTextToClipboard = (text) => {
		return new Promise(function (resolve, reject) {
			const isApiSupported = !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
			if (isApiSupported) {
				navigator.clipboard.writeText(text).then(function () {
					return resolve();
				}, function (e) {
					return reject(e);
				});
			} else {
				reject('Clipboard API is not supported');
			}
		});
	};

	expand = () => {
		const tableContainer = document.getElementById('tableContainer');
		if (tableContainer) {
			tableContainer.scrollTo({
				behavior: 'smooth',
				top: tableContainer.scrollHeight,
			});
			this.setState({
				collapse: false,
			});
		}
	};

	componentDidUpdate = (oldProps) => {
		const { refreshErrorLog: oldRefreshErrorLog } = oldProps;
		const { refreshErrorLog } = this.props;
		if (refreshErrorLog !== oldRefreshErrorLog) this.expand();
	};

	toggleCollapseLog = () => {
		const { collapse } = this.state;

		this.setState({
			collapse: !collapse
		});
	};

	render = () => {
		const {
			errors = [],
			clearLog,
			clearError,
		} = this.props;

		const {
			collapse,
		} = this.state;

		const rows = [];
		errors.forEach((error, index) => {
			const {
				action,
				message,
				statusCode,
				statusText,
			} = error;
			rows.push(
				<TableRow key={`errorLogRow${index}`}>
					<TableCell key={`errorLogCell${index}-0`}>{action}</TableCell>
					<TableCell key={`errorLogCell${index}-1`}>{message}</TableCell>
					<TableCell key={`errorLogCell${index}-2`}>{statusCode}</TableCell>
					<TableCell key={`errorLogCell${index}-3`}>{statusText}</TableCell>
					<TableCell
						className='button'
						key={`errorLogCell${index}-4`}>
						<button
							className='dismiss clear-error'
							aria-label='Dismiss error'
							onClick={() => { clearError(index); }}
						>X</button></TableCell>
				</TableRow >
			);
		});

		return (
			<div id='errorLog' className={`${errors.length > 0 ? 'show' : ''} ${collapse ? 'collapse' : ''} noprint`}>
				<header className={ERROR_LOG_TEXT_CLASS}>
					Error Log
					<div className='header-buttons-left'>
						<button
							id='collapse'
							className='collapse-log'
							aria-label={`${collapse ? 'Expand' : 'Collapse'} log`}
							onClick={this.toggleCollapseLog}
						></button>
					</div>
					<div className='header-buttons-right'>
						<button
							id='copyAll'
							className='copy-errors'
							aria-label='Copy log to clipboard'
							onClick={this.copyErrors}
						></button>
						<button
							id='clearAll'
							className='clear-error'
							aria-label='Dismiss all errors'
							onClick={clearLog}
						>X</button>
					</div>
				</header>
				<div id='tableContainer'>
					<Table className={ERROR_LOG_TEXT_CLASS}>
						<TableCaption className="sr-only">
							Application error log
						</TableCaption>
						<TableHeader className="sr-only">
							<TableRow>
								<TableHead scope="col">Action</TableHead>
								<TableHead scope="col">Message</TableHead>
								<TableHead scope="col">Status code</TableHead>
								<TableHead scope="col">Status text</TableHead>
								<TableHead scope="col">Dismiss</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows}
						</TableBody>
					</Table>
				</div>
			</div>
		);
	};
}
