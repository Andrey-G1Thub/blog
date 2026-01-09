import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconContainer = ({ className, id, inactive, title, ...props }) => (
	<div className={className} {...props} title={title}>
		<i className={`fa ${id}`} aria-hidden="true"></i>
	</div>
);

export const Icon = styled(IconContainer)`
	font-size: ${({ size = '24px' }) => size};
	margin: ${({ margin = '0' }) => margin};
	color: ${({ disabled }) => (disabled ? '#ccc' : '#000')};

	&:hover {
		cursor: ${({ inactive }) => (inactive ? 'default' : 'pointer')};
	}
`;
Icon.propTypes = {
	id: PropTypes.string,
	inactive: PropTypes.bool,
};
