using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatRepository _chatRepository;
    private readonly IUserRepository _userRepository;

    public ChatController(IChatRepository chatRepository, IUserRepository userRepository)
    {
        _chatRepository = chatRepository;
        _userRepository = userRepository;
    }

    // ... Previous GetChatMessages action ...

    [HttpPost("SendMessage")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.SenderId) || string.IsNullOrEmpty(request.ReceiverId) || string.IsNullOrEmpty(request.Content))
        {
            return BadRequest(new Response
            {
                Success = false,
                Message = "Invalid request parameters"
            });
        }

        var sender = await _userRepository.GetUserByIdAsync(request.SenderId);
        var receiver = await _userRepository.GetUserByIdAsync(request.ReceiverId);

        if (sender == null || receiver == null)
        {
            return NotFound(new Response
            {
                Success = false,
                Message = "Sender or receiver not found"
            });
        }

        var participants = new List<string> { request.SenderId, request.ReceiverId };
        var chat = await _chatRepository.GetChat(participants);

        if (chat == null)
        {
            chat = new Chat
            {
                Participants = new List<User> { sender, receiver },
                Messages = new List<Message>()
            };
            await _chatRepository.AddAsync(chat);
        }

        var message = new Message
        {
            Content = request.Content,
            SenderUser = sender,
            ReceiverUser = receiver,
            ChatId = chat.Id,
            Chat = chat,
            SentTime = DateTime.UtcNow,
            ReadStatus = false
        };

        chat.Messages.Add(message);
        await _chatRepository.UpdateAsync(chat);

        var response = new Response
        {
            Result = new SendMessageResponse
            {
                MessageId = message.Id,
                ChatId = chat.Id,
                SentTime = message.SentTime
            },
            Success = true,
            Message = "Message sent successfully"
        };

        return Ok(response);
    }
}
