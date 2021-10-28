import React from 'react';
import { UserCrudentials } from 'types';
import { ImCross } from 'react-icons/im';
import { CgSpinner } from 'react-icons/cg';
import styles from './landingPage.module.scss';
import globalStyles from 'globalStyles.module.scss';

interface Props {
	handleInputChange: (eventTarget: React.ChangeEvent<HTMLInputElement>) => void;
	loginInputValue: UserCrudentials;
	handleLogin: (e: React.SyntheticEvent) => void;
	handleCloseLoginPanel: () => void;
	isLoading: boolean;
}

export const LoginPanel: React.FunctionComponent<Props> = (props) => {
	const loading = (
		<CgSpinner
			className={globalStyles.spin}
			style={{
				fontSize: '1.54rem',
				margin: 'auto',
				display: 'block',
			}}
		/>
	);

	return (
		<form onSubmit={props.handleLogin} className={styles.form}>
			<button
				onClick={props.handleCloseLoginPanel}
				type="button"
				className={styles.buttonClose}
			>
				<ImCross />
			</button>

			<div className={styles.formContent}>
				<label className={styles.label}>Login</label>
				<input
					required
					max={20}
					onChange={props.handleInputChange}
					value={props.loginInputValue.lastName}
					name="lastName"
					type="text"
					maxLength={30}
				></input>
				<label className={styles.label}>Hasło</label>
				<input
					required
					max={20}
					onChange={props.handleInputChange}
					value={props.loginInputValue.password}
					name="password"
					type="password"
					maxLength={10}
				></input>
				<div className={styles.submitButtonContainer}>
					{props.isLoading ? (
						loading
					) : (
						<button
							type="submit"
							className={`${globalStyles.button} ${styles.submitButton}`}
						>
							Zaloguj sie
						</button>
					)}
				</div>
			</div>
		</form>
	);
};
