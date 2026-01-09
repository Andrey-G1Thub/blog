import { H2, Icon } from '../../../../components';
import { SpecialPanel } from '../special-panel/special-panel';
import { useNavigate } from 'react-router-dom';
import { PROP_TYPE } from '../../../../constants';
import styled from 'styled-components';

const PostContentContainer = ({
	className,
	post: { id, title, imageUrl, content, publishedAt },
}) => {
	const navigate = useNavigate();
	return (
		<div className={className}>
			{imageUrl ? (
				<img src={imageUrl} alt={title} />
			) : (
				<div className="image-placeholder">
					Изображение загружается или отсутствует
				</div>
			)}
			<H2>{title}</H2>
			<SpecialPanel
				id={id}
				publishedAt={publishedAt}
				margin="-20px 0 20px "
				editButton={
					<Icon
						id="fa-pencil-square-o"
						size="21px"
						margin="2px 10px -1px 0px;"
						onClick={() => navigate(`/post/${id}/edit`)}
						title="Редактировать статью"
					/>
				}
			/>
			<div className="post-text">{content}</div>
		</div>
	);
};

export const PostContent = styled(PostContentContainer)`
	& img {
		float: left;
		margin: 0 20px 10px 0;
	}

	& .post-text {
		font-size: 18px;
		white-space: pre-line;
	}
`;
PostContent.propTypes = {
	post: PROP_TYPE.POST.isRequired,
};
